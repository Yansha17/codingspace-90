
import { 
  FileText, 
  Globe, 
  Zap, 
  Code2, 
  Coffee, 
  Atom,
  Palette
} from 'lucide-react';

export interface LanguageConfig {
  name: string;
  extension: string;
  icon: any;
  bgColor: string;
  textColor: string;
  color: string; // Added for backwards compatibility
  borderColor: string; // Added for border styling
  previewable: boolean;
  runnable: boolean;
  exampleCode: string;
}

export const languages: Record<string, LanguageConfig> = {
  html: {
    name: 'HTML',
    extension: 'html',
    icon: Globe,
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-100',
    color: '#ea580c', // Orange color for compatibility
    borderColor: 'border-orange-500',
    previewable: true,
    runnable: false,
    exampleCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
</head>
<body>
    <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #333; text-align: center;">Hello World!</h1>
        <p style="color: #666; text-align: center;">This is a sample HTML page.</p>
        <button style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click Me!</button>
    </div>
</body>
</html>`
  },
  javascript: {
    name: 'JavaScript',
    extension: 'js',
    icon: Zap,
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-100',
    color: '#eab308', // Yellow color for compatibility
    borderColor: 'border-yellow-500',
    previewable: true,
    runnable: true,
    exampleCode: `// JavaScript Example
console.log("Hello, World!");

// Create a simple counter
let counter = 0;

function incrementCounter() {
    counter++;
    console.log("Counter:", counter);
    return counter;
}

// Demonstrate array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);

// Call the function
incrementCounter();
incrementCounter();`
  },
  python: {
    name: 'Python',
    extension: 'py',
    icon: Code2,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-100',
    color: '#3b82f6', // Blue color for compatibility
    borderColor: 'border-blue-500',
    previewable: false,
    runnable: true,
    exampleCode: `# Python Example
print("Hello, World!")

# Simple function to calculate factorial
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# List comprehension example
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]

print(f"Numbers: {numbers}")
print(f"Squares: {squares}")
print(f"Factorial of 5: {factorial(5)}")

# Dictionary example
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

print(f"Person: {person['name']}, Age: {person['age']}")`
  },
  cpp: {
    name: 'C++',
    extension: 'cpp',
    icon: Coffee,
    bgColor: 'bg-indigo-500',
    textColor: 'text-indigo-100',
    color: '#6366f1', // Indigo color for compatibility
    borderColor: 'border-indigo-500',
    previewable: false,
    runnable: true,
    exampleCode: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Simple class example
class Person {
private:
    string name;
    int age;
    
public:
    Person(string n, int a) : name(n), age(a) {}
    
    void introduce() {
        cout << "Hi, I'm " << name << " and I'm " << age << " years old." << endl;
    }
};

int main() {
    cout << "Hello, World!" << endl;
    
    // Vector example
    vector<int> numbers = {1, 2, 3, 4, 5};
    cout << "Numbers: ";
    for(int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    // Class usage
    Person person("Alice", 25);
    person.introduce();
    
    return 0;
}`
  },
  java: {
    name: 'Java',
    extension: 'java',
    icon: Coffee,
    bgColor: 'bg-red-500',
    textColor: 'text-red-100',
    color: '#ef4444', // Red color for compatibility
    borderColor: 'border-red-500',
    previewable: false,
    runnable: true,
    exampleCode: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Array example
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.print("Numbers: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        // Create and use object
        Person person = new Person("Bob", 30);
        person.introduce();
        
        // Simple calculation
        int sum = calculateSum(numbers);
        System.out.println("Sum: " + sum);
    }
    
    static class Person {
        private String name;
        private int age;
        
        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }
        
        public void introduce() {
            System.out.println("Hello, I'm " + name + " and I'm " + age + " years old.");
        }
    }
    
    public static int calculateSum(int[] arr) {
        int sum = 0;
        for (int num : arr) {
            sum += num;
        }
        return sum;
    }
}`
  },
  react: {
    name: 'React',
    extension: 'jsx',
    icon: Atom,
    bgColor: 'bg-cyan-500',
    textColor: 'text-cyan-100',
    color: '#06b6d4', // Cyan color for compatibility
    borderColor: 'border-cyan-500',
    previewable: true,
    runnable: false,
    exampleCode: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>React Counter</h2>
      <p>Current count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ 
          background: '#007bff', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px',
          marginRight: '10px'
        }}
      >
        Increment
      </button>
      <button 
        onClick={() => setCount(count - 1)}
        style={{ 
          background: '#dc3545', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px'
        }}
      >
        Decrement
      </button>
    </div>
  );
}

export default Counter;`
  },
  css: {
    name: 'CSS',
    extension: 'css',
    icon: Palette,
    bgColor: 'bg-pink-500',
    textColor: 'text-pink-100',
    color: '#ec4899', // Pink color for compatibility
    borderColor: 'border-pink-500',
    previewable: true,
    runnable: false,
    exampleCode: `/* CSS Example - Modern Card Design */
.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  margin: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  color: white;
  font-family: 'Arial', sans-serif;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.card h1 {
  font-size: 2.5em;
  margin: 0 0 15px 0;
  text-align: center;
}

.card p {
  font-size: 1.2em;
  line-height: 1.6;
  opacity: 0.9;
}

.btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  margin-top: 20px;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}`
  }
};

// Export the languages object as LANGUAGE_CONFIG for backwards compatibility
export const LANGUAGE_CONFIG = languages;

export const getLanguageConfig = (title: string): LanguageConfig => {
  return languages[title.toLowerCase()] || languages.javascript;
};

export const getLanguagesList = () => {
  return Object.entries(languages).map(([key, config]) => ({
    id: key,
    ...config
  }));
};

// Add the missing getLanguageComment function
export const getLanguageComment = (language: string): string => {
  const comments: Record<string, string> = {
    html: '<!-- HTML code here -->',
    javascript: '// JavaScript code here',
    python: '# Python code here',
    cpp: '// C++ code here',
    java: '// Java code here',
    react: '// React code here',
    css: '/* CSS code here */'
  };
  
  return comments[language.toLowerCase()] || '// Code here';
};
