import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

interface CustomerAlertDialogProps {
  title: string;
  description: string;
  onContinue: () => void;
  onCancel?: () => void;
}

function CustomerAlertDialog({
  title,
  description,
  onContinue,
  onCancel,
}: CustomerAlertDialogProps) {
  return (
    <>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  );
}

type DeleteCustomerAlertDialogProps = Omit<
  CustomerAlertDialogProps,
  "title" | "description"
>;

export function DeleteCustomerAlertDialog({
  onCancel,
  onContinue,
}: DeleteCustomerAlertDialogProps) {
  return (
    <CustomerAlertDialog
      title="Are you absolutely sure?"
      description="Are you sure you want to delete this customer? This action cannot be undone."
      onCancel={onCancel}
      onContinue={onContinue}
    />
  );
}
