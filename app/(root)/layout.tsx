// root layout


import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation' 
import prismadb from '@/lib/primsadb'
import { ThemeProvider } from 'next-themes';



export default async function SetupLayout({

  children,

}: {

  children: React.ReactNode;

}) {


  // require user be logged in
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }


  // prevent user from going to store of other users
  const store = await prismadb.store.findFirst({
    where: {
      userId: userId
    }
  });
  if (store) {
    redirect(`/${store.id}`);
  }

  
  // visual
  return (
    <>
      {children}
    </>
  )
}