function setThemeColor(color: string) {
  let metaThemeColor = document.querySelector(
    'meta[name="theme-color"]',
  ) as HTMLMetaElement;
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    document.head.appendChild(metaThemeColor);
  }
  metaThemeColor.setAttribute('content', color);
  document.body.style.backgroundColor = color;
}

export default setThemeColor;
