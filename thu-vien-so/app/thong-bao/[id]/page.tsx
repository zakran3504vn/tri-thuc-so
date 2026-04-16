import NotificationDetail from './NotificationDetail';

// Disable static generation for dynamic slug-based pages
export const dynamic = 'force-dynamic';

export default async function ThongBaoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NotificationDetail newsId={id} />;
}
