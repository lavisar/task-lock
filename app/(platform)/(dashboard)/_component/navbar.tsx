import { Plus } from 'lucide-react'
import Logo from '@/components/logo'
import { Button } from '@/components/ui/button'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { FormPopover } from '@/components/form/form-popover'

import { MobileSidebar } from './mobile-sidebar'
import { ThemeSwitcher } from '@/components/theme-switcher'

const Navbar = () => {
  return (
    <nav className='fix z-50 px-4 top-0 w-full h-14 border-b shadow-sm bg-white dark:bg-bgDarkMode dark:text-textDarkMode flex items-center'>
      <MobileSidebar />
      <div className='flex items-center gap-x-4'>
        <div className='hidden md:flex'>
          <Logo />
        </div>
        {/* PC */}
        <FormPopover align='start' side='bottom' sideOffset={18}>
          <Button
            variant='primary'
            size='sm'
            className='rounded-sm hidden md:block h-auto py-1.5 px-2 dark:bg-slate-500'
          >
            Create
          </Button>
        </FormPopover>
        {/* Mobile */}
        <FormPopover>
          <Button variant='primary' size='sm' className='rounded-full block md:hidden'>
            <Plus className='h-4 w-4' />
          </Button>
        </FormPopover>
      </div>
      <div className='ml-auto flex items-center gap-x-2 dark:bg-slate-500 rounded-lg p-0.5'>
        <ThemeSwitcher />
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl='/organization/:id'
          afterLeaveOrganizationUrl='/select-org'
          afterSelectOrganizationUrl='/organization/:id'
          appearance={{
            elements: {
              rootBox: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }
          }}
        />
        <UserButton
          afterSignOutUrl='/'
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30
              }
            }
          }}
        />
      </div>
    </nav>
  )
}

export default Navbar
