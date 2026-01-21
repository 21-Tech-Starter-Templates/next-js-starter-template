import { searchParamsCache } from '@/lib/searchparams';
import { getDzongkhags } from '@/actions/common/dzongkhag-actions';
import DzongkhagTable from './dzongkhag-tables';

export default async function DzongkhagListing() {
  // Get search params
  const page = searchParamsCache.get('page') || 1;
  const search = searchParamsCache.get('q');
  const limit = searchParamsCache.get('limit') || 10;

  // Parse filters
  const filters = {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    ...(search && { search })
  };

  // API call
  const data = await getDzongkhags(filters || {});
  const totalDzongkhags = data?.totalDzongkhags;
  const dzongkhags = data?.dzongkhags || [];

  return <DzongkhagTable data={dzongkhags} totalData={totalDzongkhags} />;
}
