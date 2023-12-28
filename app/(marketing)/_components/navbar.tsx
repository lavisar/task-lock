import Logo from '@/components/logo'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const Navbar = () => {
  return (
    <div className='fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center dark:bg-bgDarkMode dark:text-textDarkMode dark:border-b-gray-700'>
      <div className='md:max-w-screen-2xl mx-auto flex items-center w-full justify-between'>
        <Logo />
        <div className='ml-auto mr-1'>
          <ThemeSwitcher />
        </div>
        <div className='space-x-4 md:block md:w-auto flex justify-between w-full'>
          <Button
            size='sm'
            variant='outline'
            className='dark:bg-black dark:text-white'
            asChild
          >
            <Link href='/sign-in'>Login</Link>
          </Button>
          <Button size='sm' className='dark:bg-textDarkMode dark:text-bgDarkMode' asChild>
            <Link href='/sign-up'>Get TaskLock for free</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
