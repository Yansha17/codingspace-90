
import { 
  Globe, 
  Palette, 
  Zap, 
  Atom, 
  Heart, 
  Code, 
  Coffee, 
  Settings, 
  Smartphone, 
  Rabbit, 
  Wrench, 
  Database 
} from 'lucide-react';

export interface LanguageConfig {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: typeof Globe;
  borderColor: string;
  previewable: boolean;
  runnable: boolean;
  exampleCode: string;
}

export const LANGUAGE_CONFIG: Record<string, LanguageConfig> = {
  html: {
    name: 'HTML',
    color: '#E34F26',
    bgColor: 'bg-orange-500',
    textColor: 'white',
    icon: Globe,
    borderColor: 'border-orange-400 bg-orange-50',
    previewable: true,
    runnable: true,
    exampleCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is a paragraph with some <strong>bold text</strong>.</p>
    <ul>
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
    </ul>
    <button onclick="alert('Hello World!')">Click Me!</button>
</body>
</html>`
  },
  javascript: {
    name: 'JavaScript',
    color: '#F7DF1E',
    bgColor: 'bg-yellow-500',
    textColor: 'black',
    icon: Zap,
    borderColor: 'border-yellow-400 bg-yellow-50',
    previewable: true,
    runnable: true,
    exampleCode: `// JavaScript Example - Calculator
function calculator(a, b, operation) {
    switch(operation) {
        case 'add':
            return a + b;
        case 'subtract':
            return a - b;
        case 'multiply':
            return a * b;
        case 'divide':
            return b !== 0 ? a / b : 'Cannot divide by zero';
        default:
            return 'Invalid operation';
    }
}

// Example usage
console.log('5 + 3 =', calculator(5, 3, 'add'));
console.log('10 - 4 =', calculator(10, 4, 'subtract'));
console.log('7 * 6 =', calculator(7, 6, 'multiply'));
console.log('15 / 3 =', calculator(15, 3, 'divide'));

// Array manipulation
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log('Original:', numbers);
console.log('Doubled:', doubled);`
  },
  python: {
    name: 'Python',
    color: '#3776AB',
    bgColor: 'bg-blue-600',
    textColor: 'white',
    icon: Code,
    borderColor: 'border-blue-600 bg-blue-50',
    previewable: false,
    runnable: true,
    exampleCode: `# Python Example - Data Analysis
import math

def fibonacci(n):
    """Generate Fibonacci sequence up to n terms"""
    sequence = []
    a, b = 0, 1
    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b
    return sequence

def analyze_numbers(numbers):
    """Analyze a list of numbers"""
    if not numbers:
        return "No numbers to analyze"
    
    total = sum(numbers)
    average = total / len(numbers)
    maximum = max(numbers)
    minimum = min(numbers)
    
    return {
        'count': len(numbers),
        'sum': total,
        'average': round(average, 2),
        'max': maximum,
        'min': minimum
    }

# Example usage
fib_sequence = fibonacci(10)
print("Fibonacci sequence:", fib_sequence)

analysis = analyze_numbers(fib_sequence)
print("Analysis:", analysis)

# List comprehension example
squares = [x**2 for x in range(1, 11)]
print("Squares:", squares)`
  },
  cpp: {
    name: 'C++',
    color: '#00599C',
    bgColor: 'bg-blue-800',
    textColor: 'white',
    icon: Settings,
    borderColor: 'border-blue-800 bg-blue-50',
    previewable: false,
    runnable: false,
    exampleCode: `// C++ Example - Object-Oriented Programming
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

class Student {
private:
    std::string name;
    int age;
    std::vector<double> grades;

public:
    Student(const std::string& n, int a) : name(n), age(a) {}
    
    void addGrade(double grade) {
        if (grade >= 0.0 && grade <= 100.0) {
            grades.push_back(grade);
        }
    }
    
    double getAverage() const {
        if (grades.empty()) return 0.0;
        double sum = 0.0;
        for (double grade : grades) {
            sum += grade;
        }
        return sum / grades.size();
    }
    
    void displayInfo() const {
        std::cout << "Name: " << name << std::endl;
        std::cout << "Age: " << age << std::endl;
        std::cout << "Average Grade: " << getAverage() << std::endl;
    }
};

int main() {
    Student student("Alice Johnson", 20);
    student.addGrade(85.5);
    student.addGrade(92.0);
    student.addGrade(78.5);
    student.addGrade(96.0);
    
    student.displayInfo();
    
    return 0;
}`
  },
  java: {
    name: 'Java',
    color: '#007396',
    bgColor: 'bg-blue-700',
    textColor: 'white',
    icon: Coffee,
    borderColor: 'border-blue-700 bg-blue-50',
    previewable: false,
    runnable: false,
    exampleCode: `// Java Example - Bank Account System
import java.util.ArrayList;
import java.util.List;

public class BankAccount {
    private String accountNumber;
    private String ownerName;
    private double balance;
    private List<String> transactionHistory;
    
    public BankAccount(String accountNumber, String ownerName, double initialBalance) {
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        this.balance = initialBalance;
        this.transactionHistory = new ArrayList<>();
        addTransaction("Account opened with balance: $" + initialBalance);
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            addTransaction("Deposited: $" + amount + " | New balance: $" + balance);
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            addTransaction("Withdrew: $" + amount + " | New balance: $" + balance);
            return true;
        }
        return false;
    }
    
    public double getBalance() {
        return balance;
    }
    
    private void addTransaction(String transaction) {
        transactionHistory.add(transaction);
    }
    
    public void printStatement() {
        System.out.println("Account: " + accountNumber);
        System.out.println("Owner: " + ownerName);
        System.out.println("Current Balance: $" + balance);
        System.out.println("Transaction History:");
        for (String transaction : transactionHistory) {
            System.out.println("  " + transaction);
        }
    }
    
    public static void main(String[] args) {
        BankAccount account = new BankAccount("12345", "John Doe", 1000.0);
        account.deposit(250.0);
        account.withdraw(100.0);
        account.printStatement();
    }
}`
  },
  react: {
    name: 'React',
    color: '#61DAFB',
    bgColor: 'bg-cyan-500',
    textColor: 'black',
    icon: Atom,
    borderColor: 'border-cyan-400 bg-cyan-50',
    previewable: true,
    runnable: true,
    exampleCode: `// React Example - Todo App Component
import React, { useState } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Todo List</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px' }}>
          Add Todo
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: '10px' }}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;`
  },
  css: {
    name: 'CSS',
    color: '#1572B6',
    bgColor: 'bg-blue-500',
    textColor: 'white',
    icon: Palette,
    borderColor: 'border-blue-400 bg-blue-50',
    previewable: true,
    runnable: true,
    exampleCode: `/* CSS Example - Modern Card Design */
body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
  padding: 20px;
  min-height: 100vh;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  max-width: 300px;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card h2 {
  color: #333;
  margin: 0 0 15px 0;
  font-size: 24px;
}

.card p {
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}`
  }
};

export const getLanguageConfig = (language: string): LanguageConfig => {
  return LANGUAGE_CONFIG[language.toLowerCase()] || {
    name: language,
    color: '#6B7280',
    bgColor: 'bg-gray-600',
    textColor: 'white',
    icon: Code,
    borderColor: 'border-gray-400 bg-gray-50',
    previewable: false,
    runnable: false,
    exampleCode: '// Code here...'
  };
};

export const getLanguageComment = (language: string): string => {
  const config = getLanguageConfig(language);
  return config.exampleCode || '// Code here...';
};
