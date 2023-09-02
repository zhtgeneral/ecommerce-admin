// settings page (child) (parent page is navbar under @/compoments/navbar)



import SettingsForm from "@/app/(dashboard)/[storeId]/(routes)/settings/components/settings-form";
import prismadb from "@/lib/primsadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";



// get storeId from url using params
interface SettingsPageProps {
  params: {
    storeId: string
  }
}


const SettingsPage: React.FC<SettingsPageProps> = async ({

  params

}) => {


  // require the user be logged in
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }


  // prevent going to bogus page
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    }
  })
  if (!store) {
    redirect('/');
  }


  // visual
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingsForm store={store} />
      </div>
    </div>
  )
}

export default SettingsPage;