import Header from '@/components/layout/Header'
import { ProductForm, type FormData } from '@/components/layout/ProductForm'
import Home from '@/features/home'

export default function HomePage() {
  const handleSubmit = (data: FormData) => {
    console.log('제출된 데이터:', data);
  };

  return (
    <>
      <Header />
      <Home />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <ProductForm
          showTimeSelector={true} 
          onSubmit={handleSubmit} 
        />
      </div>
    </>
  )
}
