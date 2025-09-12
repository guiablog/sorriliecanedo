import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Gift, Star } from 'lucide-react'

const loyaltyData = {
  points: 450,
  level: 'Prata',
  nextLevel: 'Ouro',
  pointsToNextLevel: 1000,
}

const rewards = [
  {
    title: 'Desconto de 10% na Limpeza',
    cost: 200,
    description: 'Use seus pontos para economizar na sua próxima limpeza.',
  },
  {
    title: 'Kit de Higiene Bucal',
    cost: 350,
    description: 'Um kit completo com escova, pasta e fio dental especiais.',
  },
  {
    title: 'Sessão de Clareamento',
    cost: 800,
    description: 'Deixe seu sorriso mais branco com uma sessão de clareamento.',
  },
  {
    title: 'Avaliação Ortodôntica Gratuita',
    cost: 1200,
    description: 'Planeje seu tratamento ortodôntico sem custo de avaliação.',
  },
]

export default function PatientLoyalty() {
  const progress = (loyaltyData.points / loyaltyData.pointsToNextLevel) * 100

  return (
    <div className="p-4 space-y-6 animate-fade-in-up">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Nível {loyaltyData.level}
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Você tem {loyaltyData.points} pontos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
          <p className="text-sm mt-2 text-primary-foreground/80">
            Faltam {loyaltyData.pointsToNextLevel - loyaltyData.points} pontos
            para o nível {loyaltyData.nextLevel}!
          </p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-dark flex items-center gap-2">
          <Gift className="h-5 w-5 text-accent" />
          Recompensas Disponíveis
        </h2>
        <div className="space-y-4">
          {rewards.map((reward) => (
            <Card key={reward.title}>
              <CardHeader>
                <CardTitle>{reward.title}</CardTitle>
                <CardDescription>{reward.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <p className="font-bold text-secondary">{reward.cost} pontos</p>
                <Button
                  disabled={loyaltyData.points < reward.cost}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  Resgatar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
