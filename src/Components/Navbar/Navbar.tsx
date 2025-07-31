import OrbitRMSLogo from '../../assets/Images/orbitrms-final-logo-transperent.webp';
import EmployeeProfilePicture from '../EmployeeProfilePicture';

function Navbar() {
  return (
    <div className='w-full min-h-14 flex items-center justify-between border-b border-b-black/20'>
      <div className='h-full flex w-fit gap-3'>
        <div className='w-fit pl-4 flex items-center justify-center'>
          <img
            src={OrbitRMSLogo}
            width={150}
            className='w-36 h-10 object-cover'
            alt=''
          />
        </div>
        <div className='py-2'>
          <div className='bg-rose-600 h-full px-3 flex items-center justify-center rounded-lg'>
            <p className='text-base font-semibold text-white'>Admin Panel</p>
          </div>
        </div>
      </div>

      <div className='w-fit relative'>
        <div className='profile-picture pr-4'>
          <button className='flex'>
            <EmployeeProfilePicture
              width={40}
              height={40}
              profilePicture={''}
            />
          </button>
        </div>

        {/* <div
          className={classNames(
            'absolute top-full right-0 z-50 mr-4 mt-2.5 transition-all duration-150 origin-top',
            {
              'scale-y-0 opacity-0': !showNavBarDropDown,
              'scale-y-100 opacity-100': showNavBarDropDown,
            }
          )}
          ref={dropDownModalRef}
        >
          <ul className='w-full h-full bg-white border border-black/15 shadow-xl rounded-lg overflow-hidden'>
            {NavbarProfileDropDown.map((item, index) => (
              <li className='w-full' key={index}>
                {item?.type == 'link' ? (
                  <Link
                    className={classNames(
                      'text-black inline-block whitespace-nowrap px-3 py-2 hover:bg-slate-50 w-full',
                      {
                        'border-b border-b-black/15':
                          index + 1 != NavbarProfileDropDown.length,
                      }
                    )}
                    to={item?.link}
                    onClick={() => setShowNavBarDropDown(!showNavBarDropDown)}
                  >
                    <span
                      className={`flex items-center justify-start gap-3 ${item?.className}`}
                    >
                      {item?.icon}
                      <span className='font-inter text-sm font-medium'>
                        {item?.name}
                      </span>
                    </span>
                  </Link>
                ) : (
                  <button
                    className={classNames(
                      'text-black inline-block whitespace-nowrap px-3 py-2 hover:bg-slate-50 w-full disabled:opacity-65',
                      {
                        'border-b border-b-black/15':
                          index + 1 != NavbarProfileDropDown.length,
                      }
                    )}
                    onClick={handelClickOnLogoutButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <span
                        className={`w-fit flex items-start justify-start ${item?.className}`}
                      >
                        <Loader loaderText='Logging Out...' theme='dark' />
                      </span>
                    ) : (
                      <span
                        className={`flex items-center justify-start gap-3 ${item?.className}`}
                      >
                        {item?.icon}
                        <span className='font-inter text-sm font-medium'>
                          {item?.name}
                        </span>
                      </span>
                    )}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    </div>
  );
}

export default Navbar;
