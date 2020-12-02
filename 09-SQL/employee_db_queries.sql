--List the following details of each employee: employee number, last name, first name, sex, and salary.

select emp.emp_no, emp.last_name, emp.first_name, emp.sex, s.salary
from employees as emp
inner join salaries as s on 
emp.emp_no = s.emp_no;

--List first name, last name, and hire date for employees who were hired in 1986.

select emp.first_name, emp.last_name, emp.hire_date
from employees as emp
where emp.hire_date between '1985-12-31' and '1987-01-01';

--List the manager of each department with the following information: department number, department name, the manager's employee number, last name, first name.

select d.dept_no, d.dept_name, emp.emp_no, emp.last_name, emp.first_name
from departments as d
inner join dept_manager as dm on 
d.dept_no = dm.dept_no
inner join employees as emp on
dm.emp_no = emp.emp_no;

--List the department of each employee with the following information: employee number, last name, first name, and department name.

select emp.emp_no, emp.last_name, emp.first_name, d.dept_name 
from departments as d
inner join dept_emp as de on 
d.dept_no = de.dept_no
inner join employees as emp on
de.emp_no = emp.emp_no;

--List first name, last name, and sex for employees whose first name is "Hercules" and last names begin with "B."

select emp.first_name, emp.last_name, emp.sex
from employees as emp
where emp.first_name='Hercules' and emp.last_name like 'B%';

--List all employees in the Sales department, including their employee number, last name, first name, and department name.

select emp.emp_no, emp.last_name, emp.first_name, d.dept_name 
from departments as d
inner join dept_emp as de on 
d.dept_no = de.dept_no
inner join employees as emp on
de.emp_no = emp.emp_no
where d.dept_name='Sales';

--List all employees in the Sales and Development departments, including their employee number, last name, first name, and department name.

select emp.emp_no, emp.last_name, emp.first_name, d.dept_name 
from departments as d
inner join dept_emp as de on 
d.dept_no = de.dept_no
inner join employees as emp on
de.emp_no = emp.emp_no
where d.dept_name='Sales' or d.dept_name='Development';

--In descending order, list the frequency count of employee last names, i.e., how many employees share each last name.

select last_name, count(last_name) 
from employees
group by last_name
order by last_name desc;