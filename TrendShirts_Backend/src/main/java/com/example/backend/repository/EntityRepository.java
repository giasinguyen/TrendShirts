import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.model.Entity;

@Repository
public interface EntityRepository extends JpaRepository<Entity, Long> {
    // Custom query methods can be defined here
}