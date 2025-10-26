import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { PartNumber, HistoryItem } from '../types/PartNumber';

// Função auxiliar para calcular a largura das colunas
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

    // Ajusta a largura da coluna 'Descrição'
    const descIndex = header.indexOf('Descrição');
    if (descIndex !== -1) {
        widths[descIndex].wch = Math.max(widths[descIndex].wch, 50);
    }
    // Ajusta a largura da coluna 'Endereço Fabricante'
    const addrIndex = header.indexOf('Endereço Fabricante');
    if (addrIndex !== -1) {
        widths[addrIndex].wch = Math.max(widths[addrIndex].wch, 50);
    }

    return widths;
};

// Gerar Excel a partir do Validate
export const generateExcel = (partNumbers: PartNumber[]) => {
    const validatedPartNumbers = partNumbers.filter(pn => pn.status === 'validado' && pn.classification);

    if (validatedPartNumbers.length === 0) {
        alert("Nenhum Part Number validado para exportar.");
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

    // Mapeia os dados para objetos simples, garantindo a ordem das chaves como nos headers
    const dataAsObjects = validatedPartNumbers.map(pn => ({
        'Part Number': pn.value ?? '',
        'Descrição': pn.classification?.description ?? '',
        'NCM': pn.classification?.ncmCode ?? '',
        'Alíquota (%)': pn.classification?.taxRate ?? '',
        'Fabricante': pn.classification?.manufacturerName ?? '',
        'País de Origem': pn.classification?.countryOfOrigin ?? '',
        'Endereço Fabricante': pn.classification?.fullAddress ?? '',
    }));

    // Cria a planilha a partir dos objetos
    const worksheet = XLSX.utils.json_to_sheet(dataAsObjects, { header: headers });
    worksheet['!cols'] = excelFormatting(dataAsObjects, headers);
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    const descColIndex = headers.indexOf('Descrição');

    if (descColIndex !== -1) {
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            const cell_address = { c: descColIndex, r: R };
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            let cell = worksheet[cell_ref];

            // Garante que a célula exista e seja um objeto
            if (!cell || typeof cell !== 'object') {
                cell = worksheet[cell_ref] = { t: 's', v: cell || '' };
            }
            if (cell.t === undefined) {
                cell.t = 's';
            }

            cell.s = cell.s || {};
            cell.s.alignment = cell.s.alignment || {};
            cell.s.alignment.wrapText = true;
            cell.s.alignment.vertical = 'top';
            cell.s.alignment.horizontal = 'left';
        }
    }

    // Botão de filtrar colunas
    worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PartNumbers Validados');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    const fileName = `ClassiPy_Validados_${timestamp}.xlsx`;

    saveAs(dataBlob, fileName);
};

// Gerar Excel a partir do Histórico
export const generateHistoryExcel = (historyItems: HistoryItem[]) => {
    if (historyItems.length === 0) {
        alert("Nenhum item selecionado para exportar.");
        return;
    }

    const itemsToExport = historyItems.filter(item => item.classification);
    if (itemsToExport.length === 0) {
        alert("Nenhum dos itens selecionados possui dados de classificação completos para exportar.");
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

    // Mapeia os dados dos HistoryItem para objetos
    const dataAsObjects = itemsToExport.map(item => ({
        'Part Number': item.partNumber ?? '',
        'Descrição': item.classification?.description ?? '',
        'NCM': item.classification?.ncmCode ?? '',
        'Alíquota (%)': item.classification?.taxRate ?? '',
        'Fabricante': item.classification?.manufacturerName ?? '',
        'País de Origem': item.classification?.countryOfOrigin ?? '',
        'Endereço Fabricante': item.classification?.fullAddress ?? ''
    }));

    // Cria a planilha a partir dos objetos
    const worksheet = XLSX.utils.json_to_sheet(dataAsObjects, { header: headers });

    worksheet['!cols'] = excelFormatting(dataAsObjects, headers);
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    const descColIndex = headers.indexOf('Descrição');

    if (descColIndex !== -1) {
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            const cell_address = { c: descColIndex, r: R };
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            let cell = worksheet[cell_ref];

            // Garante que a célula exista e seja um objeto
            if (!cell || typeof cell !== 'object') {
                cell = worksheet[cell_ref] = { t: 's', v: cell || '' };
            }
            if (cell.t === undefined) {
                cell.t = 's';
            }

            cell.s = cell.s || {};
            cell.s.alignment = cell.s.alignment || {};
            cell.s.alignment.wrapText = true;
            cell.s.alignment.vertical = 'top';
            cell.s.alignment.horizontal = 'left';
        }
    }

    // Botão de filtrar colunas
    worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) };


    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PartNumbers Validados');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    const fileName = `ClassiPy_Validados_${timestamp}.xlsx`;

    saveAs(dataBlob, fileName);
};