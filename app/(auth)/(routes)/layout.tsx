// sign up page



export default function AuthLayout({

  children

}: {

  children: React.ReactNode

}) {


  // visual
  return (
    <div className="flex items-center justify-center h-full w-full">
      {children}
    </div>  
  )
}