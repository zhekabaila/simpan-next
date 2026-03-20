import { cookies } from 'next/headers'
import DetailPengajuanContent from './_components/DetailPengajuanContent'

interface IProps {
  params: Promise<{ id: string }>
}

export default async function DetailPengajuanPage({ params }: IProps) {
  const { id } = await params
  const c = await cookies()
  const token = c.get('token')

  return <DetailPengajuanContent id={id} token={token?.value ?? ''} />
}
