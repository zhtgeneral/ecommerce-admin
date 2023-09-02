// displays the Toaster
// (just calling <Toaster /> wouldn't be as convenient without a function that creates it for us)



import { Toaster } from 'react-hot-toast';



export const ToastProvider = () => {
  return (
    <Toaster />
  )
}
