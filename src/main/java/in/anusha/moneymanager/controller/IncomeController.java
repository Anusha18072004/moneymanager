package in.anusha.moneymanager.controller;

import in.anusha.moneymanager.dto.IncomeDTO;
import in.anusha.moneymanager.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/incomes")
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<IncomeDTO> addExpense(@RequestBody IncomeDTO dto){
        IncomeDTO saved= incomeService.addIncome(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{incomeId}")
    public ResponseEntity<IncomeDTO> updateIncome(@PathVariable Long incomeId, @RequestBody IncomeDTO dto){
        IncomeDTO updated = incomeService.updateIncome(incomeId, dto);
        return ResponseEntity.ok(updated);
    }
    @GetMapping
    public ResponseEntity<List<IncomeDTO>> getExpenses(){
        List<IncomeDTO> incomes = incomeService.getCurrentMonthIncomesForCurrentUser();
        return ResponseEntity.ok(incomes);

    }

    @DeleteMapping("/{incomeId}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long incomeId) {
        incomeService.deleteIncome(incomeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadExcel(){
        byte[] excelData = incomeService.downloadIncomeDetails();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=income_details.csv")
                .body(excelData);
    }

    @GetMapping("/email")
    public ResponseEntity<Void> sendEmail(){
        incomeService.sendIncomeDetailsByEmail();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<IncomeDTO>> getIncomesByFilter(
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

        List<IncomeDTO> incomes = incomeService.filterIncomes(start, end, keyword != null ? keyword : "", sort);
        return ResponseEntity.ok(incomes);
    }
}
