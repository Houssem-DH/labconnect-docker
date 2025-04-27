// Resources/js/Components/ReactApexcharts.tsx
import { useEffect, useState } from 'react'
import type { Props } from 'react-apexcharts'

export default function ReactApexcharts(props: Props) {
  const [Chart, setChart] = useState<React.ElementType | null>(null)

  useEffect(() => {
    // Dynamically import on client side only
    import('react-apexcharts').then((module) => {
      setChart(() => module.default)
    })
  }, [])

  if (!Chart) return null

  return <Chart {...props} />
}
}