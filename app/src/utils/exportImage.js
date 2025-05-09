import html2canvas from 'html2canvas'

/**
 * 指定したDOM要素をPNG画像として保存します
 * @param {HTMLElement} element - キャプチャ対象のDOM要素
 * @param {string} filename - 保存するファイル名（.pngを含む）
 */
export async function exportElementAsPng(element, filename = 'timeline.png') {
  if (!element) {
    console.warn('出力対象が見つかりません')
    return
  }
    // --- 透かし要素を動的に作成 ---
  const watermark = document.createElement('div')
  watermark.textContent = 'timeline.dev'
  Object.assign(watermark.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.08)',
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: '99'
  })

  // 親DOMに追加
  element.appendChild(watermark)

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      useCORS: true,
      scale: 2
    })

    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('PNG出力に失敗しました:', error)
  } finally {
    // --- 透かし要素を削除 ---
    if (element.contains(watermark)) {
        element.removeChild(watermark)
    }
  }
}