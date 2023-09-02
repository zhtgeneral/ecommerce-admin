import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from '@/components/main-nav';
import { StoreSwitcher } from './store-switcher';
import { redirect } from "next/navigation";
import prismadb from "@/lib/primsadb";
import { ModeToggle } from "./theme-toggle";


const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const allStores = await prismadb.store.findMany({
    where: {
      userId,
    }
  })



  return (
    <div className='border-b'>
      <div className='flex h-16 items-center'>
        <div className='flex items-center px-4'>
          <StoreSwitcher stores={allStores}/>
        </div>
        <MainNav />
        <div className='ml-auto flex items-center gap-x-4 pr-4'>
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}

export default Navbar;