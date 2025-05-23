/**
 * 背景色に対して読みやすい文字色（黒 or 白）を返す
 * @param {string} hex - 7桁の16進数カラー（例: '#ffffff'）
 * @returns {string} '#000000' または '#ffffff'
 */
export function getReadableTextColor(hex) {
    if (!hex || typeof hex !== 'string' || hex.length !== 7 || !hex.startsWith('#')) return '#000000'
  
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
  
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b
    return luminance < 128 ? '#ffffff' : '#000000'
  }
  
  /**
   * rgb2hex
   * @param {*} rgb 
   * @returns hex
   */
  export function rgbToHex(rgb) {
    if (!rgb.startsWith('rgb')) return rgb; // すでに hex の場合はそのまま返す
  
    const [r, g, b] = rgb.match(/\d+/g).map(Number)
    return (
      '#' +
      [r, g, b]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
    )
  }