// dashboard layout 
// defines location of navbar above children



import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'

import prismadb from "@/lib/primsadb"
import Navbar from '@/components/navbar';



export default async function DashboardLayout({

  children,
  params,

} : {

  children: React.ReactNode,
  params: { storeId: string }

}) {


  // require login
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  } 


  // prevent navigating to bogus page
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId
    }
  });
  if (!store) {
    redirect('/');
  }


  // visual
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}