import ProductForm from "../ProductForm";

export default function AdminNewProductPage() {
  return (
    <div dir="rtl">
      <h1 className="font-farsi-display text-espresso mb-5 text-xl">افزودن محصول جدید</h1>
      <ProductForm />
    </div>
  );
}
