import { Button } from "@/components/ui/button"
import {
    Stepper,
    StepperFooter,
    StepperItem,
    useStepper,
} from "@/components/ui/stepper"
import { Calendar, User, Lock } from "lucide-react"

const steps = [
    { id: 0, label: "Step 1" },
    { id: 1, label: "Step 2" },
    { id: 2, label: "Step 3" },
]

export default function StepperDemo() {
    return (
        <div className="flex w-full flex-col gap-4">
            <Stepper initialStep={0} steps={steps} orientation="vertical">
                {steps.map((step, index) => {
                    return (
                        <StepperItem key={step.id}>
                            <div className="h-40 w-full rounded-lg bg-slate-100 p-4 text-slate-900 dark:bg-slate-300">
                                <p>Step {index + 1} content</p>
                            </div>
                        </StepperItem>
                    )
                })}
                <StepperFooter>
                    <MyStepperFooter />
                </StepperFooter>
            </Stepper>
        </div>
    )
}

function MyStepperFooter() {
    const {
        activeStep,
        isLastStep,
        isOptionalStep,
        isDisabledStep,
        nextStep,
        prevStep,
        resetSteps,
        steps,
    } = useStepper()

    return (
        <div className="flex items-center justify-end gap-2">
            {activeStep === steps.length ? (
                <>
                    <Button onClick={resetSteps}>Reset</Button>
                </>
            ) : (
                <>
                    <Button disabled={isDisabledStep} onClick={prevStep}>
                        Prev
                    </Button>
                    <Button onClick={nextStep}>
                        {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
                    </Button>
                </>
            )}
        </div>
    )
}