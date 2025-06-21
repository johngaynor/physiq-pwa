"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getDietLogs } from "../state/actions";
import { getSupplements } from "../../health/state/actions";
import { DietFormValues, DietPhase } from "./types";
import { Button, Input, Label, Select, H3 } from "@/components/ui";
import { SectionWrapper, InputWrapper } from "./components/SectionWrapper";
import {
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import DietFormLoadingPage from "./components/DietFormLoadingPage";
import { DietLogSupplement } from "../state/types";
import { Trash } from "lucide-react";

function mapStateToProps(state: RootState) {
  return {
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
    supplements: state.health.supplements,
    supplementsLoading: state.health.supplementsLoading,
  };
}

const connector = connect(mapStateToProps, { getDietLogs, getSupplements });
type PropsFromRedux = ConnectedProps<typeof connector>;

const initialValues = {
  effectiveDate: new Date().toISOString().split("T")[0],
  carbs: "",
  fat: "",
  protein: "",
  phase: "",
  water: "",
  steps: "",
  cardio: "",
  cardioMinutes: "",
  notes: "",
  supplements: [],
};

const DietLogForm: React.FC<PropsFromRedux> = ({
  dietLogs,
  dietLogsLoading,
  getDietLogs,
  supplements,
  supplementsLoading,
  getSupplements,
}) => {
  const [formValues, setFormValues] = React.useState<DietFormValues>(
    initialValues as DietFormValues
  );
  React.useEffect(() => {
    if (!dietLogs && !dietLogsLoading) getDietLogs();
    if (!supplements && !supplementsLoading) getSupplements();
  }, [
    dietLogs,
    dietLogsLoading,
    getDietLogs,
    supplements,
    supplementsLoading,
    getSupplements,
  ]);

  const sortedLogs = React.useMemo(() => {
    return (
      dietLogs?.slice().sort((a, b) => {
        return (
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
        );
      }) || []
    );
  }, [dietLogs]);
  const latestLog = sortedLogs[0];

  function handleOnChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  function copyFromLastLog() {
    const newLog: DietFormValues = {
      ...initialValues,
      notes: latestLog?.notes || "",
      phase: (latestLog?.phase as DietPhase) || "",
      protein: latestLog?.protein?.toString() || "",
      carbs: latestLog?.carbs?.toString() || "",
      fat: latestLog?.fat?.toString() || "",
      water: latestLog?.water?.toString() || "",
      steps: latestLog?.steps?.toString() || "",
      cardio: latestLog?.cardio || "",
      cardioMinutes: latestLog?.cardioMinutes?.toString() || "",
      supplements: (latestLog?.supplements as DietLogSupplement[]) || [],
    };

    setFormValues(newLog);
  }

  const calories = React.useMemo(() => {
    const protein = parseFloat(formValues.protein) || 0;
    const carbs = parseFloat(formValues.carbs) || 0;
    const fat = parseFloat(formValues.fat) || 0;

    return protein * 4 + carbs * 4 + fat * 9;
  }, [formValues.protein, formValues.carbs, formValues.fat]);

  const supplementOptions = supplements?.filter(
    (s) => !formValues.supplements.some((sel) => sel.supplementId === s.id)
  );

  if (dietLogsLoading || supplementsLoading) {
    return <DietFormLoadingPage />;
  } else
    return (
      <div className="w-full mb-20">
        {/* General */}
        <SectionWrapper
          title="General"
          action={
            <Button variant="outline" onClick={copyFromLastLog}>
              Copy from Last Log
            </Button>
          }
        >
          <InputWrapper>
            <Label htmlFor="date">Effective Date (YYYY-MM-DD)</Label>
            <Input
              id="date"
              value={formValues.effectiveDate}
              onChange={handleOnChange}
              placeholder="Effective Date..."
              type="text"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formValues.notes}
              onChange={handleOnChange}
              placeholder="Notes..."
              type="text"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="phase">Phase</Label>
            <Select
              value={formValues.phase}
              onValueChange={(value) =>
                setFormValues((prev) => ({
                  ...prev,
                  phase: value as DietPhase,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Phase..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Phases</SelectLabel>
                  <SelectItem value="Bulk">Bulk</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Cut">Cut</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </InputWrapper>
        </SectionWrapper>
        {/* Nutrition */}
        <SectionWrapper title="Nutrition">
          <InputWrapper>
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              value={formValues.protein}
              onChange={handleOnChange}
              placeholder="Protein..."
              type="number"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="calories">Carbs (g)</Label>
            <Input
              id="carbs"
              value={formValues.carbs}
              onChange={handleOnChange}
              placeholder="Carbs..."
              type="number"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="fat">Fat (g)</Label>
            <Input
              id="fat"
              value={formValues.fat}
              onChange={handleOnChange}
              placeholder="Fat..."
              type="number"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="fat">Calories (kcal)</Label>
            <Input id="calories" value={calories} disabled />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="water">Water (oz)</Label>
            <Input
              id="water"
              value={formValues.water}
              onChange={handleOnChange}
              placeholder="Water..."
              type="number"
            />
          </InputWrapper>
        </SectionWrapper>
        {/* Cardio */}
        <SectionWrapper title="Cardio">
          <InputWrapper>
            <Label htmlFor="cardio">Cardio (type)</Label>
            <Input
              id="cardio"
              value={formValues.cardio}
              onChange={handleOnChange}
              placeholder="Cardio..."
              type="text"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="cardioMinutes">Cardio (min / week)</Label>
            <Input
              id="cardioMinutes"
              value={formValues.cardioMinutes}
              onChange={handleOnChange}
              placeholder="Cardio Minutes..."
              type="number"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="steps">Steps</Label>
            <Input
              id="steps"
              value={formValues.steps}
              onChange={handleOnChange}
              placeholder="Steps..."
              type="number"
            />
          </InputWrapper>
        </SectionWrapper>
        <Card className="w-full dark:bg-[#060B1C] mb-4">
          <CardHeader className="flex w-full flex-row justify-between">
            <CardTitle>
              <H3>Supplements</H3>
            </CardTitle>
            <Button
              variant="outline"
              onClick={() =>
                setFormValues((prev) => ({
                  ...prev,
                  supplements: [],
                }))
              }
            >
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            <InputWrapper>
              <Label htmlFor="phase">Add Supplements</Label>
              <Select
                onValueChange={(value) => {
                  const supp = supplements?.find(
                    (s) => s.id.toString() === value
                  );
                  if (supp) {
                    setFormValues((prev) => ({
                      ...prev,
                      supplements: [
                        ...prev.supplements,
                        { supplementId: supp.id, dosage: "", frequency: "" },
                      ],
                    }));
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Supplement..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Supplements</SelectLabel>
                    {supplementOptions?.map((supplement) => (
                      <SelectItem
                        key={supplement.id}
                        value={supplement.id.toString()}
                      >
                        {supplement.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </InputWrapper>
            {formValues.supplements.length ? (
              <Table className="mt-8">
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Supplement</TableHead>
                    <TableHead className="lg:pl-5">Dosage</TableHead>
                    <TableHead className="hidden lg:table-cell truncate overflow-hidden">
                      Frequency
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formValues.supplements.map((supp, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            const newSupplements = [...formValues.supplements];
                            newSupplements.splice(index, 1);
                            setFormValues((prev) => ({
                              ...prev,
                              supplements: newSupplements,
                            }));
                          }}
                        >
                          <Trash />
                        </Button>
                      </TableCell>
                      <TableCell>
                        {
                          supplements?.find((s) => s.id === supp.supplementId)
                            ?.name
                        }
                      </TableCell>
                      <TableCell>
                        <Input
                          value={supp.dosage}
                          onChange={(e) => {
                            const newSupplements = [...formValues.supplements];
                            newSupplements[index].dosage = e.target.value;
                            setFormValues((prev) => ({
                              ...prev,
                              supplements: newSupplements,
                            }));
                          }}
                          placeholder="Dosage..."
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={supp.frequency}
                          onChange={(e) => {
                            const newSupplements = [...formValues.supplements];
                            newSupplements[index].frequency = e.target.value;
                            setFormValues((prev) => ({
                              ...prev,
                              supplements: newSupplements,
                            }));
                          }}
                          placeholder="Frequency..."
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </CardContent>
        </Card>
        <Button
          variant="outline"
          onClick={() => alert(JSON.stringify(formValues, null, 2))} // Replace with actual submit logic
        >
          Submit
        </Button>
      </div>
    );
};

export default connector(DietLogForm);
