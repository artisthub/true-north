export const HELPDESK_PAGE_SIZE = 12;

export function parseHelpdeskPage(value: string | undefined | null) {
  const page = Number.parseInt(value || '', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function getHelpdeskPageWindow(total: number, requestedPage: number, pageSize = HELPDESK_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  const from = (page - 1) * pageSize;

  return {
    from,
    to: from + pageSize - 1,
    page,
    pageCount,
  };
}
