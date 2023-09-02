// render existing color or display create new



import prismadb from "@/lib/primsadb"
import ColorForm from "./components/color-form"



const ColorPage = async ({

  params

}: {

  params: { colorId: string }

}) => {


  const color = await prismadb.color.findUnique({
    where: {
      id: params.colorId
    }
  })


  return (
    <div className="flex-col">
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorForm color={color} />
      </div>
    </div>
  )

}


export default ColorPage;