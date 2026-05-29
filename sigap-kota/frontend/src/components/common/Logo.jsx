import logoSvg from '../../assets/logo.png'

export default function Logo({ size = 'md' }) {
  const heights = { sm: 28, md: 36, lg: 48 }

  return (
    <img
      src={logoSvg}
      alt="SIGAP KOTA"
      height={heights[size] ?? heights.md}
      style={{ height: heights[size] ?? heights.md }}
    />
  )
}