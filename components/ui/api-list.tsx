// shows all api routes for a given entity (store/billboard/ect)



'use client'

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from '@/components/ui/api-alert';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';



interface ApiListProps {
  entityName: string,
  entityIdName: string
}


export const ApiList: React.FC<ApiListProps> = ({

  entityName,
  entityIdName

}) => {


  const origin = useOrigin();
  const params = useParams();
  const baseUrl = `${origin}/api/${params.storeId}/${entityName}`


  // visual
  return (
    <div>
      <div className='pb-4'>
        <Heading title='API' description={`api routes for ${entityName}`} />
      </div>
      <Separator />
      <div className='pt-4'>
        <ApiAlert title='GET' description={baseUrl} variant='public' />
        <ApiAlert title='GET' description={`${baseUrl}/<${entityIdName}>`} variant='public' />
        <ApiAlert title='POST' description={baseUrl} variant='admin' />
        <ApiAlert title='UPDATE' description={`${baseUrl}/<${entityIdName}>`} variant='admin' />
        <ApiAlert title='DELETE' description={`${baseUrl}/<${entityIdName}>`} variant='admin' />
      </div>
    </div>
  )
}