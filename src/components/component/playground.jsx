import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "../ui/use-toast"
import { Toaster } from "../ui/toaster"

const MAX_TIME = 1000 * 60 * 60 * 24;

export default function Playground() {
    const { toast } = useToast();
    const [time, setTime] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [laps, setLaps] = useState([])
    useEffect(() => {
        let interval = null
        if (isRunning && time < MAX_TIME) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1000)
            }, 1000)
        }
        else if (time >= MAX_TIME) {
            setIsRunning(false)
            toast(
                {
                    title: "Time's up!",
                    description: "You've reached the maximum time limit.",
                    variant: "destructive"
                }
            )
        }
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isRunning])
    const handleStart = () => {
        setIsRunning(true)
    }
    const handlePause = () => {
        setIsRunning(false)
    }
    const handleReset = () => {
        setTime(0)
        setLaps([])
    }
    const handleLap = () => {
        setLaps((prevLaps) => [...prevLaps, time])
    }
    const formatTime = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const formattedSeconds = String(seconds % 60).padStart(2, "0")
        const formattedMinutes = String(minutes % 60).padStart(2, "0")
        const formattedHours = String(hours).padStart(2, "0")
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <Toaster />
            <div className="text-8xl font-bold mb-8">{formatTime(time)}</div>
            <div className="flex gap-4">
                <Button
                    onClick={handleStart}
                    disabled={isRunning}
                    className="bg-green-500 hover:bg-green-600 focus:ring-green-500"
                >
                    Start
                </Button>
                <Button
                    onClick={handlePause}
                    disabled={!isRunning}
                    className="bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500"
                >
                    Pause
                </Button>
                <Button onClick={handleReset} disabled={time === 0} className="bg-red-500 hover:bg-red-600 focus:ring-red-500">
                    Reset
                </Button>
                <Button onClick={handleLap} disabled={!isRunning} className="bg-blue-500 hover:bg-blue-600 focus:ring-blue-500">
                    Lap
                </Button>
            </div>
            {laps.length > 0 && (
                <Card className="mt-8 w-full max-w-md p-2 max-h-[30vh] overflow-auto"
                    style={{ scrollbarWidth: 'none' }}
                >
                    <CardHeader>
                        <h2 className="text-2xl font-bold mb-4">Laps</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 overflow-auto">
                            {laps.map((lap, index) => (
                                <Card key={index} className="bg-slate-600 ml-4 mr-4 rounded-lg px-4 py-2 flex justify-between">
                                    <span className="text-white"
                                    >Lap {index + 1}</span>
                                    <span className="text-white"
                                    >{formatTime(lap)}</span>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

        </div >
    )
}