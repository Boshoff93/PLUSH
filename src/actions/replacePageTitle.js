export const replacePageTitle = (page_title) => {
  return {
    type: 'REPLACE_PAGE_TITLE',
    page_title: page_title,
  }
}
