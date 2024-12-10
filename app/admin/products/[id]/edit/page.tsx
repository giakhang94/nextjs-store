import { SubmitButton } from "@/components/form/Buttons";
import CheckboxInput from "@/components/form/CheckboxInput";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import ImageInputContainer from "@/components/form/ImageInputContainer";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import { Separator } from "@/components/ui/separator";
import {
  fetchAdminProductDetails,
  updateProductAction,
  updateProductImageAction,
} from "@/utils/actions";

async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await fetchAdminProductDetails(id);
  const { name, company, description, featured, price } = product;
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">update Product</h1>
      <div className="border p-8 rounded">
        {/* Image input container */}
        <ImageInputContainer
          action={updateProductImageAction}
          image={product.image}
          name={name}
          text="update image"
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="url" value={product.image} />
        </ImageInputContainer>
        <Separator className="h-[1px] bg-gray-300" />
        {/* other fields input container */}
        <FormContainer action={updateProductAction}>
          <div className="grid gap-4 md:grid=cols-2 my-4">
            <input type="hidden" name="id" value={id} />
            <FormInput
              type="text"
              name="name"
              label="product name"
              defaultValue={name}
            />
            <FormInput
              type="text"
              name="company"
              label="Conpany"
              defaultValue={company}
            />
            <PriceInput defaultValue={price} />
            <TextAreaInput
              name="description"
              labelText="description"
              defaultValue={description}
            />
            <div className="mt-3">
              <CheckboxInput
                label="featured"
                name="featured"
                defaultChecked={featured}
              />
            </div>
          </div>
          <SubmitButton />
        </FormContainer>
      </div>
    </section>
  );
}

export default EditProductPage;
