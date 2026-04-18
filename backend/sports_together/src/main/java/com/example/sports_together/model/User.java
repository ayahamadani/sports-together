@Entity @Data @Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username, email, password;
    private String firstName, lastName;
    private Integer age, height, weight;
    private String sex, fitnessLevel;
    @ManyToMany
    @JoinTable(name="friendships",
        joinColumns=@JoinColumn(name="user_id"),
        inverseJoinColumns=@JoinColumn(name="friend_id"))
    private Set<User> friends = new HashSet<>();
}
