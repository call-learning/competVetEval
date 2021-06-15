/**
 * Criterion Tree tests
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { CriterionTreeModel } from './criterion-tree.model'
import { CriterionModel } from '../moodle/criterion.model'

describe('Criterion Tree Model', () => {
  it('Build a set criterion tree from a flat list', (done) => {
    const criteriaModel = CRITERIA_LIST.map((crit) => new CriterionModel(crit))
    const hierarchisedCrit = CriterionTreeModel.convertToTree(criteriaModel)
    expect(hierarchisedCrit.length).toEqual('2')
    expect(hierarchisedCrit[0]).toEqual(EXPECTED_TREE[0])
    expect(hierarchisedCrit[1]).toEqual(EXPECTED_TREE[1])

    done()
  })
})

const CRITERIA_LIST = [
  {
    id: 41,
    label: 'Savoir être',
    idnumber: 'Q001',
    parentid: 0,
    sort: 1,
    usermodified: 0,
    timecreated: 1619376440,
    timemodified: 1619376440,
  },
  {
    id: 42,
    label: 'Respect des horaires de travail',
    idnumber: 'Q002',
    parentid: 41,
    sort: 1,
    usermodified: 0,
    timecreated: 1619376440,
    timemodified: 1619376440,
  },
  {
    id: 43,
    label:
      'Respect des interlocuteurs (clients, personnels, encadrants, pairs, ...)',
    idnumber: 'Q003',
    parentid: 41,
    sort: 2,
    usermodified: 0,
    timecreated: 1619376440,
    timemodified: 1619376440,
  },
  {
    id: 44,
    label: 'Respect du bien-être des animaux',
    idnumber: 'Q004',
    parentid: 41,
    sort: 3,
    usermodified: 0,
    timecreated: 1619376440,
    timemodified: 1619376440,
  },
  {
    id: 45,
    label:
      'Respect des consignes vestimentaires, d’hygiène et de de biosécurité',
    idnumber: 'Q005',
    parentid: 41,
    sort: 4,
    usermodified: 0,
    timecreated: 1619376440,
    timemodified: 1619376440,
  },
  {
    id: 46,
    label: 'Respect du matériel mis à disposition',
    idnumber: 'Q006',
    parentid: 41,
    sort: 5,
    usermodified: 0,
    timecreated: 1619376440,
    timemodified: 1619376440,
  },
  {
    id: 47,
    label: 'Motivation et implication personnelle',
    idnumber: 'Q007',
    parentid: 0,
    sort: 2,
    usermodified: 0,
    timecreated: 1619376440,
    timemodified: 1619376440,
  },
  {
    id: 48,
    label:
      'Motivation à apprendre (cherche à approfondir et à discuter des cas, à améliorer ses compétences techniques)',
    idnumber: 'Q008',
    parentid: 47,
    sort: 1,
    usermodified: 0,
    timecreated: 1619376440,
    timemodified: 1619376440,
  },
  {
    id: 49,
    label: 'Capacité à prendre des initiatives et à être pro-actif',
    idnumber: 'Q009',
    parentid: 47,
    sort: 2,
    usermodified: 0,
    timecreated: 1619376440,
    timemodified: 1619376440,
  },
  {
    id: 50,
    label:
      'Capacité à s’impliquer dans le suivi des animaux pendant l’ensemble du parcours de soin',
    idnumber: 'Q010',
    parentid: 47,
    sort: 3,
    usermodified: 0,
    timecreated: 1619376440,
    timemodified: 1619376440,
  },
]

const EXPECTED_TREE = [
  {
    criterion: {
      id: 41,
      label: 'Savoir être',
      idnumber: 'Q001',
      parentid: 0,
      sort: 1,
      usermodified: 0,
      timecreated: 1619376440,
      timemodified: 1619376440,
    },
    subcriteria: [
      {
        criterion: {
          id: 42,
          label: 'Respect des horaires de travail',
          idnumber: 'Q002',
          parentid: 41,
          sort: 1,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        },
        subcriteria: [],
      },
      {
        criterion: {
          id: 43,
          label:
            'Respect des interlocuteurs (clients, personnels, encadrants, pairs, ...)',
          idnumber: 'Q003',
          parentid: 41,
          sort: 2,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        },
        subcriteria: [],
      },
      {
        criterion: {
          id: 44,
          label: 'Respect du bien-être des animaux',
          idnumber: 'Q004',
          parentid: 41,
          sort: 3,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        },
        subcriteria: [],
      },
      {
        criterion: {
          id: 45,
          label:
            'Respect des consignes vestimentaires, d’hygiène et de de biosécurité',
          idnumber: 'Q005',
          parentid: 41,
          sort: 4,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        },
        subcriteria: [],
      },
      {
        criterion: {
          id: 46,
          label: 'Respect du matériel mis à disposition',
          idnumber: 'Q006',
          parentid: 41,
          sort: 5,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        },
        subcriteria: [],
      },
    ],
  },
  {
    criterion: {
      id: 47,
      label: 'Motivation et implication personnelle',
      idnumber: 'Q007',
      parentid: 0,
      sort: 2,
      usermodified: 0,
      timecreated: 1619376440,
      timemodified: 1619376440,
    },
    subcriteria: [
      {
        criterion: {
          id: 48,
          label:
            'Motivation à apprendre (cherche à approfondir et à discuter des cas, à améliorer ses compétences techniques)',
          idnumber: 'Q008',
          parentid: 47,
          sort: 1,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        },
        subcriteria: [],
      },
      {
        criterion: {
          id: 49,
          label: 'Capacité à prendre des initiatives et à être pro-actif',
          idnumber: 'Q009',
          parentid: 47,
          sort: 2,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        },
        subcriteria: [],
      },
      {
        criterion: {
          id: 50,
          label:
            'Capacité à s’impliquer dans le suivi des animaux pendant l’ensemble du parcours de soin',
          idnumber: 'Q010',
          parentid: 47,
          sort: 3,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        },
        subcriteria: [],
      },
    ],
  },
]
