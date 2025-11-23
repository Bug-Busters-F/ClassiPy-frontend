import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import type { PartNumber, HistoryItem } from '../types/PartNumber';
import toast from 'react-hot-toast';

// --- Helpers ---
// calcula col widths (wch) como antes
const excelFormatting = (data: any[], header: string[]) => {
    const widths = header.map(h => ({ wch: h.length + 2 }));

    data.forEach(row => {
        header.forEach((key, i) => {
            const cellValue = row[key] ? String(row[key]) : '';
            const currentLength = cellValue.length;
            const maxLength = key === 'Descrição' ? 60 : 50;
            const effectiveLength = Math.min(currentLength, maxLength);

            if (widths[i].wch < effectiveLength + 2) {
                widths[i].wch = effectiveLength + 2;
            }
        });
    });

    const descIndex = header.indexOf('Descrição');
    if (descIndex !== -1) widths[descIndex].wch = Math.max(widths[descIndex].wch, 50);

    const addrIndex = header.indexOf('Endereço Fabricante');
    if (addrIndex !== -1) widths[addrIndex].wch = Math.max(widths[addrIndex].wch, 50);

    return widths;
};

// quebra texto em linhas com base em maxChars por linha (mantendo palavras)
const insertLineBreaks = (text: string, maxChars: number) => {
    if (!text) return '';
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = '';

    for (const w of words) {
        if ((current + (current ? ' ' : '') + w).length <= maxChars) {
            current = current ? `${current} ${w}` : w;
        } else {
            if (current) lines.push(current);
            // se palavra maior que maxChars, quebrar a palavra
            if (w.length > maxChars) {
                let start = 0;
                while (start < w.length) {
                    lines.push(w.substring(start, start + maxChars));
                    start += maxChars;
                }
                current = '';
            } else {
                current = w;
            }
        }
    }
    if (current) lines.push(current);
    return lines.join('\n');
};

// aplica estilos de cabeçalho e células
const applyStyles = (worksheet: XLSX.WorkSheet, headers: string[], descColIndex: number) => {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

    // header style
    headers.forEach((h, i) => {
        const ref = XLSX.utils.encode_cell({ c: i, r: 0 });
        const cell = worksheet[ref];
        if (cell) {
            cell.s = {
                font: { bold: true },
                alignment: { horizontal: 'center', vertical: 'center' },
            };
        }
    });

    // cells style: centraliza todas; descrição terá wrapText true (mas pode manter centralizado vertical)
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const ref = XLSX.utils.encode_cell({ c: C, r: R });
            const cell = worksheet[ref];
            if (!cell) continue;

            cell.s = cell.s || {};

            if (C === descColIndex) {
                // 🔹 Coluna DESCRIÇÃO → justificado + quebra de linha
                cell.s.alignment = {
                    horizontal: "justify",
                    vertical: "top",
                    wrapText: true
                };
            } else {
                // 🔹 Demais colunas → centralizadas
                cell.s.alignment = {
                    horizontal: "center",
                    vertical: "center"
                };
            }
        }
    }
};

// Define alturas de linha (!) baseado no número de quebras de linha em cada célula de descrição.
// hpt: altura em pontos (pt). Ajuste factorLineHeight se quiser linhas maiores/menores.
const buildRowHeights = (worksheet: XLSX.WorkSheet, headers: string[], descColIndex: number, defaultHeaderHeight = 20, factorLineHeight = 15) => {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    const rows: any[] = [];

    // header row height
    rows[0] = { hpt: defaultHeaderHeight };

    for (let R = 1; R <= range.e.r; ++R) {
        let maxLines = 1;
        // verificar a célula de descrição para linhas
        if (descColIndex >= 0) {
            const refDesc = XLSX.utils.encode_cell({ c: descColIndex, r: R });
            const cellDesc = worksheet[refDesc];
            if (cellDesc && typeof cellDesc.v === 'string') {
                const lines = cellDesc.v.split('\n').length;
                if (lines > maxLines) maxLines = lines;
            }
        }
        // opcional: poderia checar outras colunas que contenham '\n' também e tomar o max
        rows[R] = { hpt: Math.max(20, maxLines * factorLineHeight) };
    }

    worksheet['!rows'] = rows;
};

// --- Geração de Excel para PartNumbers validados ---
export const generateExcel = (partNumbers: PartNumber[]) => {
    const validatedPartNumbers = partNumbers.filter(pn => pn.status === 'validado' && pn.classification);

    if (validatedPartNumbers.length === 0) {
        toast.error('Nenhum Part Number validado para exportar.');
        return;
    }

    const headers = [
        'Part Number',
        'Descrição',
        'NCM',
        'Alíquota (%)',
        'Fabricante',
        'País de Origem',
        'Endereço Fabricante',
    ];

    // primeiro mapeia dados brutos
    const rawData = validatedPartNumbers.map(pn => ({
        'Part Number': pn.value ?? '',
        'Descrição': pn.classification?.description ?? '',
        'NCM': pn.classification?.ncmCode ?? '',
        'Alíquota (%)': pn.classification?.taxRate ?? '',
        'Fabricante': pn.classification?.manufacturerName ?? '',
        'País de Origem': pn.classification?.countryOfOrigin ?? '',
        'Endereço Fabricante': pn.classification?.fullAddress ?? '',
    }));

    // calcula col widths
    const cols = excelFormatting(rawData, headers);

    // estimativa de caracteres por coluna -> usar wch como proxy
    const charsPerCol = cols.map(c => Math.max(8, Math.floor((c.wch as number) - 2)));

    // agora cria objetos com quebras de linha inseridas na descrição
    const dataWithBreaks = rawData.map(row => {
        const desc = row['Descrição'] ?? '';
        const maxChars = charsPerCol[headers.indexOf('Descrição')] || 50;
        return {
            ...row,
            'Descrição': insertLineBreaks(String(desc), maxChars),
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataWithBreaks, { header: headers });
    worksheet['!cols'] = cols;

    const descColIndex = headers.indexOf('Descrição');
    applyStyles(worksheet, headers, descColIndex);

    // define alturas de linhas baseado nas quebras de linha
    buildRowHeights(worksheet, headers, descColIndex, 20, 15);

    worksheet['!autofilter'] = { ref: worksheet['!ref']! };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PartNumbers Validados');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    const fileName = `ClassiPy_Validados_${timestamp}.xlsx`;
    saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }), fileName);
};

// --- Geração de Excel a partir do Histórico ---
export const generateHistoryExcel = (historyItems: HistoryItem[]) => {
    if (!historyItems || historyItems.length === 0) {
        toast.error('Nenhum item selecionado para exportar.');
        return;
    }

    const itemsToExport = historyItems.filter(item => item.classification);
    if (itemsToExport.length === 0) {
        toast.error('Nenhum dos itens selecionados possui dados de classificação completos para exportar.');
        return;
    }

    const headers = [
        'Part Number',
        'Descrição',
        'NCM',
        'Alíquota (%)',
        'Fabricante',
        'País de Origem',
        'Endereço Fabricante'
    ];

    const rawData = itemsToExport.map(item => ({
        'Part Number': item.partNumber ?? '',
        'Descrição': item.classification?.description ?? '',
        'NCM': item.classification?.ncmCode ?? '',
        'Alíquota (%)': item.classification?.taxRate ?? '',
        'Fabricante': item.classification?.manufacturerName ?? '',
        'País de Origem': item.classification?.countryOfOrigin ?? '',
        'Endereço Fabricante': item.classification?.fullAddress ?? ''
    }));

    const cols = excelFormatting(rawData, headers);
    const charsPerCol = cols.map(c => Math.max(8, Math.floor((c.wch as number) - 2)));

    const dataWithBreaks = rawData.map(row => {
        const desc = row['Descrição'] ?? '';
        const maxChars = charsPerCol[headers.indexOf('Descrição')] || 50;
        return {
            ...row,
            'Descrição': insertLineBreaks(String(desc), maxChars),
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataWithBreaks, { header: headers });
    worksheet['!cols'] = cols;
    const descColIndex = headers.indexOf('Descrição');

    applyStyles(worksheet, headers, descColIndex);
    buildRowHeights(worksheet, headers, descColIndex, 20, 15);

    worksheet['!autofilter'] = { ref: worksheet['!ref']! };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PartNumbers Validados');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    const fileName = `ClassiPy_Validados_${timestamp}.xlsx`;
    saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }), fileName);
};
