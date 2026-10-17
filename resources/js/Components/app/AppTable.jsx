import { cn } from '@/lib/utils';

import AppEmptyState from '@/Components/app/AppEmptyState';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';

export default function AppTable({
    columns,
    rows,
    emptyTitle = 'Nothing here yet',
    emptyDescription = 'No records found.',
    className,
}) {
    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl border bg-card',
                className
            )}
        >
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        {columns.map((column) => (
                            <TableHead
                                key={column.key}
                                className={column.className}
                            >
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={columns.length}>
                                <AppEmptyState
                                    title={emptyTitle}
                                    description={emptyDescription}
                                />
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row, rowIndex) => (
                            <TableRow key={row.id ?? rowIndex}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.key}
                                        className={column.cellClassName}
                                    >
                                        {column.render
                                            ? column.render(row)
                                            : row[column.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
