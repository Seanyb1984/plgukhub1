import { notFound, redirect } from "next/navigation";
import { getFormDefinition } from "@/lib/forms/registry";
import { FormRenderer } from "@/components/forms/FormRenderer";
import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export default async function DynamicFormPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const session = await requireSession();
  const formDefinition = getFormDefinition(id);

  if (!formDefinition) {
    notFound();
  }

  // Helper to "Sterilize" the definition (removes functions so they don't crash the Client Component)
  const serializedDefinition = JSON.parse(JSON.stringify(formDefinition));

  async function handleSubmit(formData: any) {
    "use server"; 

    const siteId = session.user.siteId || (session.user as any).site?.id;
    const practitionerId = session.user.id;

    if (!siteId) {
      throw new Error("Your account is not linked to a clinic site. Please contact Admin.");
    }

    const signature = formData.signature || formData.practitioner_signature || formData.patient_signature || null;

    try {
      await prisma.formSubmission.create({
        data: {
          formType: id,
          brand: session.user.brand as any,
          siteId: siteId, 
          practitionerId: practitionerId, 
          data: formData,
          signatureData: signature,
          signedAt: signature ? new Date() : null,
          status: "SUBMITTED",
          submittedAt: new Date(),
        }
      });
    } catch (error) {
      console.error("Prisma Save Error:", error);
      throw new Error("Failed to save clinical record to database.");
    }

    redirect("/admin/submissions");
  }

  return (
    <div className="min-h-screen bg-white">
      <FormRenderer 
        // Pass the serialized version (no functions) to the client
        definition={serializedDefinition} 
        user={session.user}
        onSubmit={handleSubmit} 
      />
    </div>
  );
}
