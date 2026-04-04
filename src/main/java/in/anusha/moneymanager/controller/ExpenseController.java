package in.anusha.moneymanager.controller;

import in.anusha.moneymanager.dto.ExpenseDTO;
import in.anusha.moneymanager.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDTO> addExpense(@RequestBody ExpenseDTO dto){
        ExpenseDTO saved= expenseService.addExpense(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable Long expenseId, @RequestBody ExpenseDTO dto){
        ExpenseDTO updated = expenseService.updateExpense(expenseId, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getExpenses(){
        List<ExpenseDTO> expenses = expenseService.getCurrentMonthExpensesForCurrentUser();
        return ResponseEntity.ok(expenses);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long expenseId){
        expenseService.deleteExpenseById(expenseId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadExcel(){
        byte[] excelData = expenseService.downloadExpenseDetails();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=expense_details.csv")
                .body(excelData);
    }

    @GetMapping("/email")
    public ResponseEntity<Void> sendEmail(){
        expenseService.sendExpenseDetailsByEmail();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByFilter(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortDirection
    ){
        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.fromString(sortDirection),
                sortBy != null && !sortBy.isEmpty() ? sortBy : "date"
        );

        java.time.LocalDate start = startDate != null && !startDate.isEmpty() ? java.time.LocalDate.parse(startDate) : java.time.LocalDate.of(1970, 1, 1);
        java.time.LocalDate end = endDate != null && !endDate.isEmpty() ? java.time.LocalDate.parse(endDate) : java.time.LocalDate.of(9999, 12, 31);

        List<ExpenseDTO> expenses = expenseService.filterExpenses(start, end, keyword != null ? keyword : "", sort);
        return ResponseEntity.ok(expenses);
    }
}
