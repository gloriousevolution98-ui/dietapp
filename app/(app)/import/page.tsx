import { importFoodMasterAction } from "@/app/(app)/import/actions";
import { ImportWizardScreen } from "@/components/import/import-wizard-screen";

export default function ImportPage() {
  return <ImportWizardScreen importFoodMaster={importFoodMasterAction} />;
}
