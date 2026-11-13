'use client'
import { Trash2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { JobPosting } from "../dashboard/recruiter/jobs/page"
import { deleteJob } from "@/lib/actions/jobs"
import { useState } from "react"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

interface DeleteJobProps {
  job: JobPosting;
}

export function DeleteJobAlertDialog({ job }: DeleteJobProps) {

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDeleteJobe = async () => {
    console.log("Deleting job: ", job._id);
    const result = await deleteJob(job._id);
    console.log("Deleted job result: ", result);
    setOpen(false);
    toast.add({
      type: 'success',
      title: "Job Deleted Successfully",
      description: job.jobTitle,
    });
    router.refresh();
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="destructive"><Trash2Icon /></Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Job?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this job with all the details.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteJobe}
            variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
