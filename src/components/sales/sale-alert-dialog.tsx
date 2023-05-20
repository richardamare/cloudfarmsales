import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

interface SaleAlertDialogProps {
  title: string;
  description: string;
  onContinue: () => void;
  onCancel?: () => void;
}

function SaleAlertDialog({
  title,
  description,
  onContinue,
  onCancel,
}: SaleAlertDialogProps) {
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

type DeleteSaleAlertDialogProps = Omit<
  SaleAlertDialogProps,
  "title" | "description"
>;

export function DeleteSaleAlertDialog({
  onCancel,
  onContinue,
}: DeleteSaleAlertDialogProps) {
  return (
    <SaleAlertDialog
      title="Are you absolutely sure?"
      description="Are you sure you want to delete this sale? This action cannot be undone."
      onCancel={onCancel}
      onContinue={onContinue}
    />
  );
}
