import DemoForm from '@/components/forms/demo-form';
import PageContainer from '@/components/layout/page-container';

export default function Page() {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        {/* Overview content */}
        <div>
          <h1>Overview Page Content Here</h1>
          {/* Demo Form -- Remove once you know how to use it */}
          <DemoForm />
        </div>
      </div>
    </PageContainer>
  );
}
