import { fetchWorkflowData } from '@zealthy-app/actions/data';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@zealthy-app/components/ui/table';

export default async function DataPage() {
  const data = await fetchWorkflowData();

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Workflow Data</h1>
      <Table>
        <TableCaption>A list of user workflows and associated data</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Workflow Name</TableHead>
            <TableHead>Workflow ID</TableHead>
            <TableHead>Step</TableHead>
            <TableHead>Component</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.workflowName}</TableCell>
                <TableCell>{row.workflowId}</TableCell>
                <TableCell>{row.step}</TableCell>
                <TableCell>{row.component}</TableCell>
                <TableCell>{typeof row.data === 'string' ? row.data : JSON.stringify(row.data)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
