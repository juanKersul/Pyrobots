import ListarRobots from '../ListarRobots/ListarRobots';
import {render, screen} from '@testing-library/react';
jest.mock("axios");

const fakeListRobots = [
    {
        "id": 5,
        "name": "Krlos",
        "avatar": "asdf",
        "matchs_pleyed": 2,
        "matchs_won": 2,
        "avg_life_time": 80
    },
    {
        "id": 54,
        "name": "Krlos2",
        "avatar": "asdfgfg",
        "matchs_pleyed": 23,
        "matchs_won": 2,
        "avg_life_time": 10
    },
    {
        "id": 5,
        "name": "Krlos3",
        "avatar": "sisi",
        "matchs_pleyed": 9,
        "matchs_won": 0,
        "avg_life_time": 30
    }
  ]

/*
 const defaultimgRobot = "./robot.png"

 axios.get.mockImplementation(() => Promise.resolve({ RobotImages: [
    [defaultimgRobot, fakeListRobots[0].name, fakeListRobots[0].id, fakeListRobots[0].matchs_pleyed, fakeListRobots[0].matchs_won],
    [defaultimgRobot, fakeListRobots[1].name, fakeListRobots[1].id, fakeListRobots[1].matchs_pleyed, fakeListRobots[1].matchs_won],
    [defaultimgRobot, fakeListRobots[2].name, fakeListRobots[2].id, fakeListRobots[2].matchs_pleyed, fakeListRobots[2].matchs_won],
]}));

beforeEach(() => {
    render(<ListarRobots.Listing robots={fakeListRobots}/>)    
})
*/
test('test name in list correct to list take', () => {
    /*
    expect(screen.getByText(`Krlos`)).toBeInTheDocument()
    expect(screen.getByText(`Krlos2`)).toBeInTheDocument()
    expect(screen.getByText(`Krlos3`)).toBeInTheDocument()
    */
})

/*
test('lenght list correct', () => {
    const robotsNames = screen.getAllByTestId('robot-name')
    expect(robotsNames).toHaveLength(3);
})
*/