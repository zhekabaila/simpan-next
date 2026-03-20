import { ProfilStep1Form } from '../_components/ProfilStep1Form'
import { ProfilStep2Form } from '../_components/ProfilStep2Form'
import { ProfilStep3Form } from '../_components/ProfilStep3Form'

interface IProps {
  params: Promise<{ step: string }>
}

export default async function ProfilStepPage({ params }: IProps) {
  const { step } = await params
  const stepNumber = parseInt(step, 10)

  switch (stepNumber) {
    case 1:
      return <ProfilStep1Form />
    case 2:
      return <ProfilStep2Form />
    case 3:
      return <ProfilStep3Form />
    default:
      return <ProfilStep1Form />
  }
}
