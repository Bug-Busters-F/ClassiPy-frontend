import { motion, useAnimation } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { useInView } from 'react-intersection-observer';

interface FadeInOnScrollProps {
    children : ReactNode
}

const FadeInOnScroll = ({children}: FadeInOnScrollProps) => {
    const controls = useAnimation();
    const[ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2
    })

    useEffect(() => {
        if (inView){
            controls.start('visible')
        }
    }, [controls, inView])

  return (
    <motion.div ref={ref} animate={controls} initial="hidden" transition={{duration: 0.7, ease: 'easeOut'}} variants={{hidden: {opacity: 0, y: 40}, visible: {opacity: 1, y: 0  }}}>
        {children}
    </motion.div>
  )
}

export default FadeInOnScroll