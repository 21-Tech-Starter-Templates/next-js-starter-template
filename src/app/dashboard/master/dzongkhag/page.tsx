import PageContainer from '@/components/layout/page-container';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { productInfoContent } from '@/config/infoconfig';
import DzongkhagListing from './_components/dzongkhag-listing';
import { CreateDzongkhagDialog } from './_components/add-dzongkhag-dialog-box';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export const metadata = {
  title: 'Dashboard: Dzongkhags'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  // const key = serialize({ ...searchParams });

  return (
    <PageContainer
      scrollable={false}
      pageTitle="Dzongkhags"
      pageDescription="Manage dzongkhags (Server side table functionalities.)"
      infoContent={productInfoContent}
      pageHeaderAction={<CreateDzongkhagDialog />}
    >
      <Suspense
        // key={key}
        fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
      >
        <DzongkhagListing />
      </Suspense>
    </PageContainer>
  );
}
