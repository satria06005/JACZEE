"use server";

export async function submitContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "Semua kolom harus diisi." };
  }

  try {
    // Note: ContactMessage schema is currently not in DB.
    // In a real scenario with Prisma schema synced, we would do:
    // await prisma.contactMessage.create({ data: { name, email, message } })
    
    console.log("Contact Message Received:", { name, email, message });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error("Contact error:", error);
    return { success: false, error: "Terjadi kesalahan saat mengirim pesan." };
  }
}
