import { useNavigate } from 'react-router-dom'
import SittingCat from '@/assets/images/cat/animated/sitting.gif'
import HomeBg from '@/assets/images/backgrounds/HomeScreenBackground.png'
import { PlayCircle } from 'lucide-react'
export const PetDashboardCard = () => {
  const navigate = useNavigate()
  return (
    <div
      className="relative flex flex-col items-center justify-end rounded-2xl shadow p-4 h-90 w-full overflow-hidden"
      style={{
        backgroundImage: `url(${HomeBg})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <button
        className="absolute top-2 right-2 bg-cozy-lavender text-white rounded-full p-2 shadow hover:bg-cozy-pink transition"
        onClick={() => navigate('/cat-room-game')}
        aria-label="Go to Cat Room Game"
      >
        <PlayCircle className="w-4 h-4" />
      </button>
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 z-10">
        <img
          src={SittingCat}
          alt="Your Cat"
          className="w-30 h-30"
          style={{ objectFit: 'contain' }}
        />
        <div className="bg-primary/60 p-2 rounded-md w-full">
          <div className="font-bold text-lg text-center text-white">Mochi</div>
          <div className="text-sm text-white text-center">Status: Happy</div>
        </div>
      </div>
    </div>
  )
}
