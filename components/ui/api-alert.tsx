// custom visual for api alert



import { Copy, Server } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Button } from "./button"
import toast from "react-hot-toast"



interface ApiAlertProps {
  title: string,
  description: string,
  variant: 'public' | 'admin'
}


// going map[key] returns its value
// create different types of Alerts for admin/public
const textMap: Record<ApiAlertProps['variant'], string> = {
  public: "Public",
  admin: "Admin"
}


// create differrent types of Alerts for regular/destructive
const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive'
}


export const ApiAlert: React.FC<ApiAlertProps> = ({

  title,
  description,
  variant

}) => {


  // handles copy and paste
  const copyToClipboard = () => {
    navigator.clipboard.writeText(description);
    toast.success('API route copied to clipboard');
  } 


  // visual
  return (
    <div className='pb-4'>
      <Alert>
        <Server className='h-4 w-4'/>

        <AlertTitle className='flex items-center gap-x-2'>
          {title}
          <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>

        </AlertTitle>
        <AlertDescription className='mt-4 flex items-center justify-between'>

          <code className='relative rounded bg-muted px-[0.3rem] py-[0.2ren] font-mono text-sm font-semibold'>
            {description}
          </code>

          <Button variant='outline' size='icon' onClick={copyToClipboard}>
            <Copy className='w-4 h-4' />
          </Button>

        </AlertDescription>
      </Alert>
    </div>

  )

  
}