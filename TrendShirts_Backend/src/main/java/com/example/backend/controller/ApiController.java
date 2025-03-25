import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/products")
    public String getProducts() {
        return "List of products";
    }

    @GetMapping("/users")
    public String getUsers() {
        return "List of users";
    }

    @GetMapping("/orders")
    public String getOrders() {
        return "List of orders";
    }
}