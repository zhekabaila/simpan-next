import { redirect, RedirectType } from 'next/navigation'

function HomePage() {
  return redirect('/login', RedirectType.replace)
}

export default HomePage
